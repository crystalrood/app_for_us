var CronJob = require('cron').CronJob;


const async = require('async');
const Quickshifts_customer_timeline = require('../models/Quickshifts_customer_timeline.js');
const Secondaryshift = require('../models/Secondaryshift.js');
const Shift = require('../models/Shift.js');
const User = require('../models/User.js');
const Finalshift = require('../models/Finalshift.js');
const People = require('../models/People.js');
const Finalemployeeshift = require('../models/Finalemployeeshift.js');
const EventEmitter = require('events');
//const asyncLoop = require('node-async-loop');
/*
-----------------------------------------------------
-------GETTING ALL INFORMATION NEEDED FOR PAGE LOAD
-----------------------------------------------------
*/


//this fucntion round to the nearest day
function roundDate(timeStamp){
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);//subtract amount of time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;//add on the timezone offset
    return new Date(timeStamp);
}

//a function to only return unique values of an array, used in the below code
//search for onlyUnique
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function get_pretty_date(value){
  var start_date = new Date(value)
  var s_year = start_date.getFullYear();
  var s_month = start_date.getMonth() + 1;
  if(s_month <= 9)
      s_month = '0'+s_month;
  var s_day= start_date.getDate();
  if(s_day <= 9)
      s_day = '0'+s_day;

  var s_prettyDate = s_month +'-'+ s_day + '-'+  s_year
  return s_prettyDate
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}



//got this function from a search
//http://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript
function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}


function manager_final_shifts(a, b, callback) {
  Finalshift.find(
    {$and:[
      {userid: a},
      {date_range_start: b}]},
    function (err, shifts) {
      if (err) { return callback(err); }

      //if nothing is found in final shifts this means it needs to be added
      if (shifts.length == 0){

        //finding secondary shifts that match the criteria

        var datetouse = get_pretty_date(b)

        Secondaryshift.find(
        {$and:[
          {userid: a},
          {date_range_start: datetouse}
        ]},
        function (err, shft) {
          if (err) return handleError(err);

          //checking to ensure we're actually going to be adding documents
          if (shft.length >= 1){
            //iterating through each document and adding it to the
            //secondary collection
            shft.forEach(function(shft, index) {
              const sec_shift = new Finalshift({
                userid: a,
                date_range_start: shft.date_range_start,
                date_range_end: shft.date_range_end,
                employee_type: shft.employee_type,
                days_worked: shft.days_worked,
                num_employees: shft.num_employees,
                shift_start_time: shft.shift_start_time,
                shift_end_time: shft.shift_end_time}
              );

              sec_shift.save((err) => {
                if (err) {return next(err);}
              });

            });

          };

          //removing the shifts i just saved from secondary shifts

          Secondaryshift.remove({$and:[
            {userid: a},
            {date_range_start: datetouse}
            ]}, (err) =>
              {
                if (err) { return next(err); }
              }
            );

        //end of finding secondary shifts
        });

      //end of checking the shifts length
      }

    //end of final shifts search
        callback();
    })

}



/*
new CronJob('* * * * * *', function() {
/// this code here is for populating quickshift customer timelines
  console.log('You will see this message every second');
  Quickshifts_customer_timeline.find(function (err,docs){
    if (err) { return callback(err); }
      //setting an array up to collect distinct manager user_id
      var manager_user_ids = []
      //console.log(docs)
      //collating all the manager user id's then using a function defined above
      //to get unique manager user ids'
      for (i = 0; i <= docs.length-1; i++) {
        manager_user_ids.push(docs[i].manager_userid)
      }

      if (docs.length == 0){
        console.log('show this')
      }

      var unique_manager_user_ids = manager_user_ids.filter(onlyUnique);

      var max_per_manager = []

      //goal with the below code is to 1) get the max schedule #

      //looping through manager user_id's and comparing to with the overall json
      for (i = 0; i<= unique_manager_user_ids.length-1; i++){
        for(j = 0; j<= docs.length-1; j++){
          if (unique_manager_user_ids[i] == docs[j].manager_userid ){
             if (!max_per_manager[i] || parseInt(docs[j].week_num) > parseInt(max_per_manager[i].week_num)){
                 max_per_manager[i] = docs[j];
             }
          }
        }
      }

      //now i need to loop through the array of maxes and identifty the ones that are
      // less than 5 weeks out
      var five_weeks_from_now = new Date().getTime() + (5*7*60*60*24*1000);
      var lastest_schedule_start_date = new Date()

      for (i = 0; i<=max_per_manager.length-1; i++ ){

        lastest_schedule_start_date = new Date(max_per_manager[i].schedule_start)

        if (lastest_schedule_start_date < five_weeks_from_now){
          // 1) need to see how many weeks i need to fill in to exceed 5 weeks
          // 2) need to set loop parameter to be from 1
          // 3) need to save to database

          //step 1
          var timeDiff = Math.abs(five_weeks_from_now - lastest_schedule_start_date);
          var diffDays = Math.ceil(timeDiff / (7 * 1000 * 3600 * 24));

          var schedule_start = new Date(lastest_schedule_start_date);
          var schedule_end = new Date(lastest_schedule_start_date);
          var schedule_release = new Date(schedule_start - (7*60*60*24*1000));
          var employee_lockout = new Date(schedule_start - (8*60*60*24*1000));
          var manager_lockout = new Date(schedule_start - (13*60*60*24*1000));

          schedule_start.setTime((schedule_start.getTime()+(7*60*60*24*1000)))
          schedule_end.setTime((schedule_end.getTime()+(13*60*60*24*1000)))

          //step 2
          for(j = 0; j<= diffDays; j ++){

            schedule_start.setTime((schedule_start.getTime()+(j*7*60*60*24*1000)))
            schedule_end.setTime((schedule_end.getTime()+(j*7*60*60*24*1000)))
            schedule_release.setTime((schedule_release.getTime()+(j*7*60*60*24*1000)))
            employee_lockout.setTime((employee_lockout.getTime()+(j*7*60*60*24*1000)))
            manager_lockout.setTime((manager_lockout.getTime()+(j*7*60*60*24*1000)))


           const quickshifts_customer_timeline = new Quickshifts_customer_timeline({
              "week_num": parseInt(max_per_manager[i].week_num) + j + 1,
              "manager_userid" : max_per_manager[i].manager_userid,
              "manager_email"  : max_per_manager[i].manager_email,
              "schedule_start" : schedule_start.toDateString(),
              "schedule_end"  : schedule_end.toDateString(),
              "final_schedule_release"  : schedule_release.toDateString(),
              "employee_lockout"  : employee_lockout.toDateString(),
              "manager_lockout"  : manager_lockout.toDateString()
              });

            quickshifts_customer_timeline.save((err) => {
              if (err) {
                return next(err);
              }
              console.log(quickshifts_customer_timeline)
              console.log("SAVED!");
            });

          }


        }
      }




    //where Quickshifts_customer_timeline.find ends
    }
  // where cronjob ends
  )


}, null, true, 'America/Los_Angeles');
*/


/*
new CronJob('* * * * * *', function() {
//this cron popualtes secondary shifts for the manager side of things
  console.log('You will see this message every second');
  var locals = {};
  var tasks = [
      function(callback){
        Secondaryshift.find(function (err, docs) {
          if (err) { return callback(err); }
          if (docs != null){
            locals.shifts = docs;
            callback();
          }
          else{
            locals.shifts = docs;
            callback();
          }
        });
      },
      function(callback){
        Shift.find(function (err, docs) {
          if (err) { return callback(err); }
          if (docs != null){
            locals.all_shifts = docs;
            callback();
          }
          else{
            locals.all_shifts = docs;
            callback();
          }
        });
      },

      function(callback){
          Quickshifts_customer_timeline.find( function (err, docs1) {
          if (err) { return next(err); }
          if (docs1 != null){
            locals.schedule = docs1;
            callback();
          }
          else{
            locals.schedule = docs1;
            callback();
          }

        });
      },

      function(callback){
          User.find({user_type: "schedule_type"}, function (err, docs1) {
          if (err) { return next(err); }
          if (docs1 != null){
            locals.manage = docs1;
            callback();
          }
          else{
            locals.manage = docs1;
            callback();
          }

        });
      },



  ];

async.parallel(tasks, function(err) {
// this call fills out secondary shifts

    if (err) return next(err);
    //getting manager id for the first manager
    //console.log(locals.manage[0]._id)

    //******
    //******
    //iterating through all the manager_id's
    var manager_id
    for (var i = 0; i < locals.manage.length; i++){
        manager_id = locals.manage[i]._id
        //console.log(manager_id)
        //console.log(locals.shifts)


        //******
        //******
        //getting the max_date for what is currently in the secondary shifts table
        var max_date;
        for (var j=0 ; j<locals.shifts.length ; j++) {
          if (manager_id == locals.shifts[j].user_id) {
            if (!max_date || parseInt(locals.shifts[j].date_range_start) > parseInt(max_date)){
              max_date = locals.shifts[j].date_range_start;
            }
          }
         }

         //if there is no data in shifts the set date to a random date very
         //far in pass
         if(locals.shifts.length == 0){
           max_date = '01-01-1972'
         }


         //******
         //******
         // iterating through all the customer timelines and comparing
         // with the max date to understand if
        var schedule_dates_greater_than_max= []

        for(var j=0; j< locals.schedule.length; j++){
          if(manager_id == locals.schedule[j].manager_userid){

            //need to convert date to the same format
            var s_prettyDate = get_pretty_date(locals.schedule[j].schedule_start)

            //comparing to see if the current max date is smaller than
            //anything in the schedule array
            if (s_prettyDate >max_date){
              schedule_dates_greater_than_max.push(s_prettyDate)
            }
        }
        }


        //******
        //******
        //checking to ensure there were things added to the array above, if not
        //i don't want to send any data processing to next steps outlined below
        if(schedule_dates_greater_than_max.length >0){

          //need to add code so i can push the dates from schedule_dates_greater_than_max
          //into a json and build information about schedules around that
          for(var j=0; j<schedule_dates_greater_than_max.length; j++){

            //ensuring that the there are shifts in the data
            if (locals.all_shifts.length >= 1){

              //for any given shift add the corresponding schedule start
              // and end date to the secondary shifts json
              //then i will add it to the database
              for(var p=0; p< locals.all_shifts.length; p++){
                if(manager_id == locals.all_shifts[p].userid){
                  var thedate = addDays(schedule_dates_greater_than_max[j], 6)
                  var theprettydate = get_pretty_date(thedate)

                  var start_date = schedule_dates_greater_than_max[j]
                  var end_date = theprettydate

                  const sec_shift = new Secondaryshift({
                    userid: manager_id,
                    date_range_start: start_date,
                    date_range_end: end_date,
                    employee_type: locals.all_shifts[p].employee_type,
                    days_worked: locals.all_shifts[p].days_worked,
                    num_employees: locals.all_shifts[p].num_employees,
                    shift_start_time: locals.all_shifts[p].shift_start_time,
                    shift_end_time: locals.all_shifts[p].shift_end_time}
                  );

                  //saving the shfit :)
                  sec_shift.save((err) => {
                    if (err) {return next(err);}
                    console.log("SAVED!");
                  });
                }
              }
            }
          }
        }




     }



//ending async parallel call
});
}, null, true, 'America/Los_Angeles');
*/





new CronJob('* * * * * *', function() {
//this cron is to push from manager secondary shifts to manager final shifts
// and also deletes all secondary shifts that was pushed
/// this code here is for populating quickshift customer timelines
console.log('peanuts rocks my socks')
  Quickshifts_customer_timeline.find(function (err,docs){
    if (err) { return callback(err); }
      //setting an array up to collect distinct manager user_id
      var manager_user_ids = []
      //console.log(docs)
      //collating all the manager user id's then using a function defined above
      //to get unique manager user ids'
      for (i = 0; i <= docs.length-1; i++) {
        manager_user_ids.push(docs[i].manager_userid)
      }

      if (docs.length == 0){
        console.log('show this')
      }

      //getting unique manager userid's
      var unique_manager_user_ids = manager_user_ids.filter(onlyUnique);


      // **** code logic shift
      //here should be all the logic behind getting the info for the
      // secondary shift and final shift databases


      //setting a variable for today's date
      var date_today = new Date().getTime()
      var date_manager_lockout
      var date_schedule_start

      //going through each manager user id
      for (i = 0; i<= unique_manager_user_ids.length-1; i++){
        console.log('manager iteration # '+i)
        //creating array to push all manager lockouts too
        var manager_is_lockedout = []

        //looping though everything in the database
        for(j = 0; j<= docs.length-1; j++){
          //checking to ensure that i'm looking at the manager specific
          //document from database
          if (unique_manager_user_ids[i] == docs[j].manager_userid ){
            //checking to see if schedule start date

            //needed to create varible to convert date to unix time for comparison
            date_manager_lockout = new Date(docs[j].manager_lockout).getTime()

            if(date_manager_lockout <= date_today){
              date_schedule_start = new Date(docs[j].schedule_start).toDateString()
              manager_is_lockedout.push(date_schedule_start)
            //end of manager lockout date comparision within docs
            }
          //the if to match docs with manager user_id
          }

        //end of docs loop
        }

        //here i'm trying to pull in all the final shift information to
        //check if the final shift was added to the schedule start array

        var shifts_not_in_final = []
        var date_range_start
        var manager_userid = unique_manager_user_ids[i]

        //got this code from a search
        //due to how async works with node and mongodb, can't run a loop with nested find functions
        //this code below allows me to do so

        /*
        asyncLoop(manager_is_lockedout.length, function(loop){
          manager_final_shifts(manager_userid, manager_is_lockedout[loop.iteration()], function(result) {

            // Okay, for cycle could continue
            loop.next();

          })},
              function(){console.log('')}

        );

        */

        //***** another logic break
        //***   the code below copies form manager final shift to employee final shift

        // need to get the dates that need to be filled in the employee database
        //below logic compares current date to the manger lockout
        //if equal to the manager lockout i add the date to an array
        var employee_final_needs_filled = []

        //setting a variable for today's date
        var date_today = new Date().getTime() + (9*60*60*24*1000);
        date_today = roundDate(date_today).getTime()

        //looping though everything in the database
        for(j = 0; j<= docs.length-1; j++){
          //checking to ensure that i'm looking at the manager specific
          //document from database
          if (manager_userid == docs[j].manager_userid ){
            //checking to see if schedule start date

            //needed to create varible to convert date to unix time for comparison
            date_manager_lockout = new Date(docs[j].manager_lockout).getTime()
            date_manager_lockout = roundDate(date_manager_lockout).getTime()
            if(date_manager_lockout == date_today){
              date_schedule_start = new Date(docs[j].schedule_start).toDateString()
              employee_final_needs_filled.push(date_schedule_start)
            //end of manager lockout date comparision within docs
            }
          //the if to match docs with manager user_id
          }
        //end of docs loop
        }


        //console.log(employee_final_needs_filled)

        //this should theoretically only be 1, if it's not one, erik and i need
        // to understand what is going on
        if(employee_final_needs_filled.length == 1){

          //code below pulls all employees and employee types from the people db
          People.find(
          {$and:[
            {mgr_userid: manager_userid}
          ]},
          function (err, emp) {
            if (err) return handleError(err);

            //need to convert to pretty date before pushing through final shifts
            var datetouse = get_pretty_date(employee_final_needs_filled[0])

            Finalshift.find(
              {$and:[
                {userid: manager_userid},
                {date_range_start: datetouse}]},
              function (err, shift) {
                if (err) { return callback(err); }

                  //now i need to iterate through all the shifts and save to
                  //each empployee

                  emp.forEach(function(emp, index) {
                    shift.forEach(function(shift,index){

                      if(shift.employee_type == emp.type){
                        //getting the dasy
                        var str = shift.days_worked
                        var str_array = str.split(',')
                        for(var i = 0; i < str_array.length; i++) {
                          // Trim the excess whitespace.
                          str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");


                          Finalemployeeshift.update(
                            {$and:[
                              {email: emp.userid},
                              {date_range_start: shift.date_range_start},
                              {date_range_end: shift.date_range_end},
                              {employee_type: shift.employee_type},
                              {days_worked:  str_array[i]},
                              {num_employees: shift.num_employees},
                              {shift_start_time: shift.shift_start_time},
                              {shift_end_time: shift.shift_end_time}
                            ]},
                            {$set:
                              {email: emp.userid,
                              date_range_start: shift.date_range_start,
                              date_range_end: shift.date_range_end,
                              employee_type: shift.employee_type,
                              days_worked:   str_array[i],
                              num_employees: shift.num_employees,
                              shift_start_time: shift.shift_start_time,
                              shift_end_time: shift.shift_end_time}
                            },
                            {upsert: true},
                              function(err, test) {
                                  if (err) {
                                      console.log(err);
                                  }
                                  else {
                                      console.log(test);
                                  }
                              }
                            );

                      //going through array of shifts days
                      }
                    //ending cheking to ensure we're only adding if employee types match
                    }

                    //ending going through each shift
                    })

                  //ending going through each employee pulled
                  });
              //ending looking for final manager shift
              })
          //ending people find
          })

        //end of checking how many dates i need to backfill for
        };



        if(employee_final_needs_filled.length > 1){
        //set up code here to automate and email to me and peanuts

        }

        //***** another logic break end
        //**********


      //end of manager loop
      }

    //where Quickshifts_customer_timeline.find ends
    }

  // where cronjob ends
  )


}, null, true, 'America/Los_Angeles');
