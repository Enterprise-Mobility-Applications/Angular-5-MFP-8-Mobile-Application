package SMSComposer;

import org.json.JSONArray;
import org.json.JSONException;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
public class SMSComposer extends CordovaPlugin {
      public final String ACTION_SEND_SMS = "showSMSComposer";
      
      @Override
      public boolean execute(String action, JSONArray arg1, CallbackContext callbackContext) {
    	  System.out.println("action"+action+" JSONArray"+arg1);
    	  // PluginResult result = new PluginResult(Status.INVALID_ACTION);
          try {
                String phoneNumber = arg1.getString(0);
                String message = arg1.getString(1);
                Log.d("SMS", phoneNumber+","+message);
                sendSMS(phoneNumber, message);
                //result = new PluginResult(Status.OK);
                return true;
          }
          catch (JSONException ex) {
        	  ex.printStackTrace();
			  return false;
          }                 
      }
      private void sendSMS(String phoneNumber, String message) {
    	  Uri uri = Uri.parse("smsto:" + phoneNumber);
          Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
          intent.putExtra("sms_body", message);  
          cordova.getActivity().startActivity(intent);
      }
}


