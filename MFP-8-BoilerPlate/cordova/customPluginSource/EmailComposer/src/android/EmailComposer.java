package EmailComposer;

import java.io.File;
import java.util.ArrayList;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
/*import org.apache.cordova.Plugin;*/
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.Uri;
import android.text.Html;

/**
 * EmailComposer is a PhoneGap plugin that bridges Android intents and web
 * applications:
 * 
 * 1. web apps can spawn intents that call native Android applications. 2.
 * (after setting up correct intent filters for PhoneGap applications), Android
 * intents can be handled by PhoneGap web applications.
 * 
 */
public class EmailComposer extends CordovaPlugin {
	//Actions to be perform
	public static final  String SEND_MAIL_MULTIPLE_ATTACHMENT = "attachMultipleImages";
	public static final  String SEND_MAIL = "startActivityForFilePhysicalPath";
	public static final int EMAIL_SENT_SUCCESS=1;
	/**
	 * Executes the request and returns PluginResult.
	 * 
	 * @param action
	 *            The action to execute.
	 * @param args
	 *            JSONArray of arguments for the plugin.
	 * @param callbackId
	 *            The callback id used when calling back into JavaScript.
	 * @return A PluginResult object with a status and message.
	 */
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext)
	{
		try
		{
			if (action.equals(SEND_MAIL))
			{
				// Parse the arguments
				JSONObject obj = args.getJSONObject(0);
				String type = obj.has("type") ? obj.getString("type") : null;
				String path = obj.has("path") ? obj.getString("path") : null;
				String subject = obj.has("subject") ? obj.getString("subject") : null;
				String text = obj.has("text") ? obj.getString("text") : null;
				String emailTo = obj.has("to") ? obj.getString("to") : null;
				
				sendSingleAttachment(Intent.ACTION_SEND, path, type, subject, text, emailTo);
				
				callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
				return true;
			}
			
			if (action.equals(SEND_MAIL_MULTIPLE_ATTACHMENT))
			{
				// Parse the arguments
				JSONObject obj = args.getJSONObject(0);
				String type = obj.has("type") ? obj.getString("type") : null;
				JSONArray path = (JSONArray) (obj.has("path") ? obj.get("path") : null);
				String subject = obj.has("subject") ? obj.getString("subject") : null;
				String text = obj.has("text") ? obj.getString("text") : null;
				String emailTo = obj.has("to") ? obj.getString("to") : null;

				System.out.println("Calling multiple attachments !");
				sendMultipleAttachments(Intent.ACTION_SEND_MULTIPLE, path, type, subject, text, emailTo);
				System.out.println("Returning from multiple attachments !");

				callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
				return true;
			}
			
			//return new PluginResult(PluginResult.Status.INVALID_ACTION);
			callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
			return false;

		}
		catch (JSONException e)
		{
			e.printStackTrace();
			callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
			return false;
		}
	}

	/* This method starts new activity. */
	// It takes action to perform,takes attachment file physical path,input type
	// and list of extra parameters ex: subject,body etc
	void sendSingleAttachment(String action, String path, String type, String subject, String text, String emailTo)
	{

		Intent i = new Intent(action);
		if (type != null)
		{
			//i.setType(type);
			i.setType("message/rfc82");
		}

		Uri uri = null;
		if (path != null)
		{

			File f = new File(path);
			if (f.exists())
			{
				uri = Uri.fromFile(f);
			}
		}

		i.putExtra(Intent.EXTRA_SUBJECT, subject);
		i.putExtra(Intent.EXTRA_TEXT, Html.fromHtml(text));
		i.putExtra(Intent.EXTRA_EMAIL, new String[]{ emailTo });
		if(uri != null)
			i.putExtra(Intent.EXTRA_STREAM, uri);

		//ctx.startActivity(Intent.createChooser(i, "Send mail..."));
		cordova.getActivity().startActivity(Intent.createChooser(i, "Send mail..."));
	}
	
	
	/* This method starts new activity. */
	// It takes action to perform,array of attachment files,input type
	// and list of extra parameters ex: subject,body etc
	void sendMultipleAttachments(String action, JSONArray path, String type, String subject, String text, String emailTo)
	{
		System.out.println("Total attachments are :"+path.length());

		Intent i = new Intent(action);
		if (type != null)
		{
			//i.setType(type);
			i.setType("message/rfc82");
		}

		i.putExtra(Intent.EXTRA_SUBJECT, subject);
		i.putExtra(Intent.EXTRA_TEXT,  Html.fromHtml(text));
		i.putExtra(Intent.EXTRA_EMAIL, new String[]
		{ emailTo });

		if (path != null)
		{
			ArrayList<Uri> uris = new ArrayList<Uri>();
			for (int pathIndex = 0; pathIndex < path.length(); pathIndex++)
			{
				String filePath;
				try
				{
					filePath = path.getString(pathIndex);

					File f = new File(filePath);
					if (f.exists())
					{
						Uri uri = Uri.fromFile(f);
						uris.add(uri);
					}
				}
				catch (JSONException e)
				{
					e.printStackTrace();
				}
			}
			
			i.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
		}
		cordova.getActivity().startActivityForResult(Intent.createChooser(i, "Select.."),EMAIL_SENT_SUCCESS);
		//this.ctx.startActivityForResult(this,Intent.createChooser(i, "Select.."),EMAIL_SENT_SUCCESS);
	}
	
}