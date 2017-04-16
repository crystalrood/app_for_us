var CronJob = require('cron').CronJob;


const async = require('async');
const Quickshifts_customer_timeline = require('../models/Quickshifts_customer_timeline.js');
const Secondaryshift = require('../models/Secondaryshift.js');
const Shift = require('../models/Shift.js');
const User = require('../models/User.js');
const EventEmitter = require('events');
/*
-----------------------------------------------------
-------GETTING ALL INFORMATION NEEDED FOR PAGE LOAD
-----------------------------------------------------
*/

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

/*
new CronJob('* * * * * *', function() {
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
*/
            /* define what needs to be saved*/
/*            const quickshifts_customer_timeline = new Quickshifts_customer_timeline({
              "week_num": parseInt(max_per_manager[i].week_num) + j + 1,
              "manager_userid" : max_per_manager[i].manager_userid,
              "manager_email"  : max_per_manager[i].manager_email,
              "schedule_start" : schedule_start.toDateString(),
              "schedule_end"  : schedule_end.toDateString(),
              "final_schedule_release"  : schedule_release.toDateString(),
              "employee_lockout"  : employee_lockout.toDateString(),
              "manager_lockout"  : manager_lockout.toDateString()
              });

            //quickshifts_customer_timeline.save((err) => {
            //  if (err) {
            //    return next(err);
            //  }
            //  console.log(quickshifts_customer_timeline)
            //  console.log("SAVED!");
            //});

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
