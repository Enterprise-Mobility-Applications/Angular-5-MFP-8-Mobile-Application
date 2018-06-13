package DatePickerPlugin;

import java.lang.reflect.Field;

import android.util.Log;
import java.util.Calendar;
import java.util.Date;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.DatePickerDialog.OnDateSetListener;
import android.app.TimePickerDialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.Context;
import android.view.View;
import android.widget.DatePicker;
import android.widget.TimePicker;
import android.widget.DatePicker.OnDateChangedListener;


public class DatePickerPlugin extends CordovaPlugin  {

	private static final String ACTION_DATE = "date";	
	private static final String ACTION_SHOW_CALENDAR = "showCalendar";
	private static final String ACTION_TIME = "time";
	private final String pluginName = "DatePickerPlugin";
	private Date date;
	private CordovaInterface currentCtx;
	private String action = "date";
	private boolean useNativeDateValidation=false;
	DatePickerDialog dateDialogGlobal;
	TimePickerDialog timeDialogGlobal; 
	private CallbackContext callbackContext;
	
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.phonegap.api.Plugin#execute(java.lang.String,
	 * org.json.JSONArray, java.lang.String)
	 */
	@Override
	 public boolean execute(String action, JSONArray data, CallbackContext callbackContext) 
	{
		this.callbackContext=callbackContext;
		Log.d(pluginName, "DatePicker called with options: " + data);
		PluginResult result = null;
		if (action.equals("dismissDialogBoxes"))
		{
			 dismissDialogBoxes();
			 System.out.println("dismissDialogBoxes dismiss");
			 return true;
		}
		else
		{
			System.out.println("in else------------------");
			this.show(data, callbackContext);
			result = new PluginResult(PluginResult.Status.NO_RESULT);
			result.setKeepCallback(true);

		}
		this.callbackContext.sendPluginResult(result);
		return true;
		
	}
	
	public synchronized void dismissDialogBoxes()
	{
		Log.d(pluginName, "DatePicker dismissDialogBoxes function called in java");
		if(dateDialogGlobal != null)
			dateDialogGlobal.dismiss();
		if(timeDialogGlobal != null)
			timeDialogGlobal.dismiss();
	}
	
	public synchronized void show(final JSONArray data, final CallbackContext callbackContext)
	{
		final DatePickerPlugin datePickerPlugin = this;
		//currentCtx = ctx;
		final Context currentCtx = cordova.getActivity();// getContext();
		final Calendar c = Calendar.getInstance();
		final Runnable runnable;

		/*
		 * Parse information from data parameter and where possible, override
		 * above date fields
		 */
		int month = -1, day = -1, year = -1, hour = -1, min = -1;
		try
		{
			JSONObject obj = data.getJSONObject(0);
			action = obj.getString("mode");

			String optionDate = obj.getString("date");

			String[] datePart = optionDate.split("/");
			month = Integer.parseInt(datePart[0]);
			day = Integer.parseInt(datePart[1]);
			year = Integer.parseInt(datePart[2]);
			
			//hour and min values are coming as '0' always from Java Script Date object.Hence assigning them to -1.
				
			hour = Integer.parseInt(datePart[3]);
			min = Integer.parseInt(datePart[4]);

			/* currently not handled in Android */
			// boolean optionAllowOldDates = obj.getBoolean("allowOldDates");

		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}

		// By default initalize these fields to 'now'
		final int mYear = year == -1 ? c.get(Calendar.YEAR) : year;
		final int mMonth = month == -1 ? c.get(Calendar.MONTH) : month - 1;
		final int mDay = day == -1 ? c.get(Calendar.DAY_OF_MONTH) : day;
		final int mHour = hour == -1 ? c.get(Calendar.HOUR_OF_DAY) : hour;
		final int mMinutes = min == -1 ? c.get(Calendar.MINUTE) : min;
		final int currentMonth = c.get(Calendar.MONTH);
		final int currentYear = c.get(Calendar.YEAR);
		
		if (ACTION_TIME.equalsIgnoreCase(action))
		{
			runnable = new Runnable()
			{
				public void run()
				{
					final TimeSetListener timeSetListener = new TimeSetListener(datePickerPlugin, callbackContext);
					final TimePickerDialog timeDialog = new TimePickerDialog((Context) currentCtx, timeSetListener, mHour, mMinutes, false);
					timeDialogGlobal = timeDialog; 
					timeDialog.show();
				}
			};

		}
		else if (ACTION_DATE.equalsIgnoreCase(action))
		{
			runnable = new Runnable()
			{
				public void run()
				{
					
					//final DateSetListener dateSetListener = new DateSetListener(datePickerPlugin, callbackContext);
					final DateSetListener dateSetListener = new DateSetListener(datePickerPlugin, callbackContext);
					final DatePickerDialog dateDialog = new DatePickerDialog((Context) currentCtx, dateSetListener, mYear, mMonth, mDay);
					/*This feature is not used to control date as in this project ,its supported from  API Level 11 in android.*/
					DatePicker dp=dateDialog.getDatePicker();
					dp.setMaxDate(new Date().getTime());
					dateDialogGlobal = dateDialog;
					dateDialog.show();
				}
			};

		}
		else if (ACTION_SHOW_CALENDAR.equalsIgnoreCase(action))
		{
			runnable = new Runnable()
			{
				public void run()
				{
					
					//final DateSetListener dateSetListener = new DateSetListener(datePickerPlugin, callbackContext);
					final DateSetListener dateSetListener = new DateSetListener(datePickerPlugin, callbackContext);
					final DatePickerDialog dateDialog = new DatePickerDialog((Context) currentCtx, dateSetListener, mYear, mMonth, mDay);
					/*This feature is not used to control date as in this project ,its supported from  API Level 11 in android.
					 *DatePicker dp=dateDialog.getDatePicker();
					dp.setMaxDate(new Date().getTime());*/
					dateDialog.getDatePicker().setMinDate(System.currentTimeMillis() - 1000);
					dateDialogGlobal = dateDialog;
					dateDialog.show();
				}
			};

		}else
		{
			Log.d(pluginName, "Unknown action. Only 'date' or 'time' are valid actions");
			return;
		}
		//ctx.runOnUiThread(runnable);
		cordova.getActivity().runOnUiThread(runnable);
	}
	
	private final class DateSetListener implements OnDateSetListener {		
		private final DatePickerPlugin datePickerPlugin;
		private final CallbackContext callbackContext;
		
		private DateSetListener(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext)
		{
			this.datePickerPlugin = datePickerPlugin;
			this.callbackContext = callbackContext;
		}
		

		/**
		 * Return a string containing the date in the format YYYY/MM/DD
		 */
		public void onDateSet(final DatePicker view, final int year, final int monthOfYear, final int dayOfMonth)
		{
			//Log.d("expirationDate","true");
			String returnDate = year + "/" + (monthOfYear + 1) + "/" + dayOfMonth;
			date = new Date(returnDate);// Initialize the global date variable to make it use to set time later on the same object
						
			
				//Check here,if input date is greater than todays date then prompt the user to enter the date only till todays date(Not to enter date greater than todays date).
				if(useNativeDateValidation)
				if(validateDate(view))
				 {
					 //datePickerPlugin.callbackContext.error(new PluginResult(PluginResult.Status.INVALID_ACTION,returnDate));
					datePickerPlugin.callbackContext.error("Error");
					 new AlertDialog.Builder((Context) currentCtx).setTitle("").setMessage("Date can not be a future date").setNeutralButton("Ok", null).show();  	 
					 return;
			     }
				
			dateDialogGlobal = null;
			this.callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, returnDate));
		}
			
	    private boolean validateDate(DatePicker tempView) 
	    {
	        Calendar mCalendar = Calendar.getInstance();
	        Calendar tempCalendar = Calendar.getInstance();
	        
	        Log.d("Temp year", ""+ tempView.getYear());
	        Log.d("Temp month", ""+ tempView.getMonth());
	        Log.d("Temp day", ""+ mCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
	        
	        tempCalendar.set(tempView.getYear(), tempView.getMonth(), mCalendar.getActualMaximum(Calendar.DAY_OF_MONTH), 0, 0, 0);	             	
		    return tempCalendar.after(mCalendar);		            
	    }
	}

	private final class TimeSetListener implements OnTimeSetListener {
		
		private final CallbackContext callbackContext;

		private TimeSetListener(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext)
		{
			
			this.callbackContext = callbackContext;
		}

		/**
		 * Return the current date with the time modified as it was set in the
		 * time picker.
		 */
		public void onTimeSet(final TimePicker view, final int hourOfDay, final int minute)
		{
			date.setHours(hourOfDay);
			date.setMinutes(minute);
			String result = formatDate(date);
			timeDialogGlobal = null;			
			this.callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, result.toString()));

		}
	}
	
	/*
	 * This function is called to format the date and display it in specific
	 * format.
	 */
	private String formatDate(Date date)
	{
		String[] weekday = new String[7];
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";

	    String itrAmPm = date.getHours() >= 12 ? "PM" : "AM";
	    String intDay = weekday[date.getDay()];
	    String intMonth = formatedMonth(date.getMonth());
	    int intYear = date.getYear() + 1900;
	    int intTodayDate = date.getDate();
	    int intHours = date.getHours();

	    if (intHours > 12) intHours = intHours - 12;

	    int intTempMin = date.getMinutes();
	    String intMinuts = ""+intTempMin;
	    if (intTempMin <= 9)
	    	intMinuts = "0" + intTempMin;
	    
	    String formattedDate="";
	    if(useNativeDateValidation)
	    		formattedDate = intDay + " " + intMonth + " " + intTodayDate + ", " + intYear + " " + intHours + ":" + intMinuts + " " + itrAmPm;
	    	else
	    	   formattedDate = date.getDate() + "," + (date.getMonth()) + "," + intYear + "," +intHours + "," + intMinuts + "," + itrAmPm;
		 
	    
	    //System.out.println("formattedDate in java :-------"+formattedDate);
	    return formattedDate;
	}
	
	private String formatedMonth(int index)
	{
		String[] month = new String[12];
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		return month[index];
	}
}
