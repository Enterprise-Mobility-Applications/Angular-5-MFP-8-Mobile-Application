package FileManager;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URL;
import java.net.URLConnection;
import java.io.InputStream;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.webkit.MimeTypeMap;

import com.metlife.digitalservicing.MainActivity;

public class FileManager extends CordovaPlugin {

 public static final String SAVE_FILE = "save";
 public static final String DELETE_FILE = "delete";
 public static final String OPEN_FILE = "open";
 public static final String SAVE_OPEN_FILE = "saveOpen";
 public static final String DOWNLOAD_FILE = "download";
 public static final String ERROR = "Error";
 private static final String DEBUG_TAG = "Base64TofILE";
 private CallbackContext callbackContext;

 /**
  * Executes the request and returns true/false.
  * @param action The action to execute.
  * @param args JSONArry of arguments for the plugin.
  * @param callbackContext The callbackContext used when calling back into JavaScript.
  * @return A boolean object.
  */

 @Override
 public boolean execute(String action, JSONArray args,
  CallbackContext callbackContext) throws JSONException {
  this.callbackContext = callbackContext;
  if (SAVE_FILE.equals(action) || SAVE_OPEN_FILE.equals(action)) {
   try {
    String b64String = args.getString(0);

    JSONObject params = new JSONObject();
    String filename = args.getString(2);

    String folder = Environment.getExternalStorageDirectory() + "/" + MainActivity.dirName;
    String extension = args.getString(1);
    Boolean overwrite = params.has("overwrite") ? params
     .getBoolean("overwrite") : true;

    if (SAVE_FILE.equals(action)) {
     String filePath = this.saveFile(b64String, filename, folder, overwrite,
      callbackContext.getCallbackId(), extension);
     if (ERROR.equals(filePath)) {
      callbackContext.sendPluginResult(new PluginResult(
       PluginResult.Status.ERROR, "Error in File Manager plugin!"));
      return false;
     }
     callbackContext.sendPluginResult(new PluginResult(
      PluginResult.Status.OK, filename + "." + extension));
     return true;
    } else if (SAVE_OPEN_FILE.equals(action)) {
     Boolean isFileViewer = this.detectFileViewer(extension);
     System.err.println("isFileViewer--->" + isFileViewer);
     if (isFileViewer) {
      String filePath = this.saveFile(b64String, filename, folder, overwrite,
       callbackContext.getCallbackId(), extension);
      System.err.println("filePath-->" + filePath);
      if (ERROR.equals(filePath)) {
       callbackContext.sendPluginResult(new PluginResult(
        PluginResult.Status.ERROR, "Error in File Manager plugin!"));
       return false;
      }
      this.openFile(filePath, extension);
      System.err.println("filename---->" + filename);
      callbackContext.sendPluginResult(new PluginResult(
       PluginResult.Status.OK, filename + "." + extension));
      return true;
     } else {
      callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "noViewer"));
      return false;
     }
    }
   } catch (JSONException e) {
    System.out.println("json" + e.getMessage());
    Log.e(DEBUG_TAG, e.getMessage());

    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.JSON_EXCEPTION, e.getMessage()));
    return false;
   } catch (InterruptedException e) {
    System.out.println("InterruptedException" + e.getMessage());
    Log.e(DEBUG_TAG, e.getMessage());
    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.ERROR, e.getMessage()));
    return false;
   }
  } else if (OPEN_FILE.equals(action)) {
    String filename = args.getString(0);
    String folder = Environment.getExternalStorageDirectory() + "/Download";
    String extension = args.getString(1);
   try {
    if (this.detectFileViewer(extension)) {
     //To distinguish no viewer case for downloaded pdf file
     if (extension.toLowerCase().compareTo("pdf") == 0) {
      boolean isOpenSuccess = this.openDownloadedFile(filename, extension);
      if (isOpenSuccess) {
       callbackContext.sendPluginResult(new PluginResult(
        PluginResult.Status.OK, "OK"));
       return true;
      } else {
       callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "noViewer"));
       return false;
      }
     } else {
      this.openFile(folder + "/" + filename + "." + extension, extension);
     }
    } else {
     callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, "noViewer"));
     return false;
    }
   } catch (JSONException e) {
    System.out.println("json" + e.getMessage());
    Log.e(DEBUG_TAG, e.getMessage());

    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.JSON_EXCEPTION, e.getMessage()));
    return false;
   } catch (InterruptedException e) {
    System.out.println("InterruptedException" + e.getMessage());
    Log.e(DEBUG_TAG, e.getMessage());
    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.ERROR, e.getMessage()));
    return false;
   }

  } else if (DOWNLOAD_FILE.equals(action)) {
   final JSONArray arguments = args;
   final String urlToDownload = arguments.getString(0);
   final String filename = arguments.getString(1);
   final String extension = arguments.getString(2);
   final boolean overrideUserAgent = arguments.getBoolean(3);
   final CallbackContext callbackContextForDownload = callbackContext;

   cordova.getThreadPool().execute(new Runnable() {
    public void run() {
     String folder = Environment.getExternalStorageDirectory() + "/Documents";


     File file = new File(folder, filename + "." + extension);
     File parent = file.getParentFile();

     try {
      if (!parent.exists() && !parent.mkdirs()) {
       throw new IllegalStateException("Couldn't create dir: " + parent);
      }
      file.getParentFile().mkdirs();
      file.createNewFile();

      final URLConnection connection = new URL(urlToDownload).openConnection();
      connection.setConnectTimeout(60000);
      connection.setReadTimeout(60000);

      if (overrideUserAgent) {
       connection.addRequestProperty("User-Agent", "Mozilla/5.0");
      }

      final FileOutputStream output = new FileOutputStream(file, false);
      final byte[] buffer = new byte[2048];
      int read;
      final InputStream input = connection.getInputStream();
      while ((read = input.read(buffer)) > -1)
       output.write(buffer, 0, read);
      output.flush();
      output.close();
      input.close();

      callbackContextForDownload.sendPluginResult(new PluginResult(PluginResult.Status.OK, filename));
     } catch (Exception e) {
      Log.e(DEBUG_TAG, "Error: " + e.getMessage());
      callbackContextForDownload.sendPluginResult(new PluginResult(
       PluginResult.Status.ERROR, e.getMessage()));

     }
    }
   });

   PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT, "KEEP_CALLBACK");
   r.setKeepCallback(true);
   callbackContextForDownload.sendPluginResult(r);
   return true;
  } else if (DELETE_FILE.equals(action)) {
   try {
    File folder = new File(Environment.getExternalStorageDirectory() + "/Documents");
    File[] listOfFiles = folder.listFiles();
    for (int i = 0; i < listOfFiles.length; i++) {
     if (listOfFiles[i].isFile()) {
      listOfFiles[i].delete();
     }
    }
    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.OK, "Deletion Done"));
    return true;
   } catch (Exception e) {
    System.err.println("Exception-->" + e.getMessage());
    Log.e(DEBUG_TAG, e.getMessage());
    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.ERROR, e.getMessage()));
    return false;
   }
  } else {
   System.err.println("--->else");
   callbackContext.sendPluginResult(new PluginResult(
    PluginResult.Status.INVALID_ACTION));
  }
  return false;

 }

 /**
  * Function Name: saveFile Function Parameters: b64String - Base64 string
  * fileName - Name of the file that will be created dirName - Directory
  * path to store the path callbackId - callback function Description: This
  * function creates the file and save it on Memory card of Phone.
  */
 private String saveFile(String b64String, String fileName, String dirName,
   Boolean overwrite, String callbackId, String fileExt) throws InterruptedException,
  JSONException {
   String result = dirName + "/" + fileName + "." + fileExt;
   fileName = fileName + "." + fileExt;
   try {
    // Directory and File
    File dir = new File(dirName);
    if (!dir.exists()) {
     dir.mkdirs();
    }
    File file = new File(dirName, fileName);
    System.out.println("file:" + file);
    // Avoid overwriting a file
    if (!overwrite && file.exists()) {
     callbackContext.sendPluginResult(new PluginResult(
      PluginResult.Status.OK, "File already exists!"));
     return result;
    }
    byte[] decodedBytes = Base64.decode(b64String, Base64.DEFAULT);
    System.out.println("decodedBytes java: " + decodedBytes.toString());
    // Save Binary file to phone
    file.createNewFile();
    FileOutputStream fOut = new FileOutputStream(file);
    BufferedOutputStream bos = new BufferedOutputStream(fOut);

    bos.write(decodedBytes);
    bos.flush();
    bos.close();

    Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
    Uri contentUri = Uri.fromFile(file);
    mediaScanIntent.setData(contentUri);
    this.cordova.getActivity().getApplicationContext().sendBroadcast(mediaScanIntent);


    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.OK, file.getAbsoluteFile().toString()));
    return result;
   } catch (FileNotFoundException e) {
    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.ERROR, "File not Found!"));
    return ERROR;
   } catch (IOException e) {
    Log.e(DEBUG_TAG, e.getMessage());
    callbackContext.sendPluginResult(new PluginResult(
     PluginResult.Status.ERROR, e.getMessage()));
    return ERROR;
   }
  }

 /**
  * Function Name: openFile Function Parameters: b64String - Base64 string
  * fileName - Name of the  file that will be opened.
  * Description: This function opens the file.
  */
 private boolean openFile(String fileName, String fileExt) throws InterruptedException,
  JSONException {
   String result = fileName;

   try {
    File opneFile = new File(result);
    Intent intent = new Intent(Intent.ACTION_VIEW);
    intent.setDataAndType(Uri.fromFile(opneFile), MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileExt));
    cordova.startActivityForResult(this, intent, 1);
   } catch (android.content.ActivityNotFoundException e) {
    String errString = result + "|err";
    PluginResult pr = null;
    try {
     pr = new PluginResult(PluginResult.Status.ERROR, errString);
    } catch (Exception e1) {
     Log.e(DEBUG_TAG, e1.getMessage());
    }
    callbackContext.sendPluginResult(pr);
    return false;
   }
   callbackContext.sendPluginResult(new PluginResult(
    PluginResult.Status.OK, result));
   return true;
  }

 /**
  *
  * Function Name: openDownloadedFile Function Parameters: b64String - Base64 string
  * fileName - Name of the  file that will be opened.
  * Description: This function opens the downloaded file without returning the result to callbackContext.
  */
 private boolean openDownloadedFile(String fileName, String fileExt) throws InterruptedException,
  JSONException {
   String result = fileName;

   try {
    File opneFile = new File(result);
    Intent intent = new Intent(Intent.ACTION_VIEW);
    intent.setDataAndType(Uri.fromFile(opneFile), MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileExt));
    cordova.startActivityForResult(this, intent, 1);
   } catch (android.content.ActivityNotFoundException e) {
    String errString = result + "|err";
    PluginResult pr = null;
    try {
     pr = new PluginResult(PluginResult.Status.ERROR, errString);
    } catch (Exception e1) {
     Log.e(DEBUG_TAG, e1.getMessage());
    }

    return false;
   }
   callbackContext.sendPluginResult(new PluginResult(
    PluginResult.Status.OK, result));
   return true;
  }

 private boolean detectFileViewer(String fileExt) throws InterruptedException,
  JSONException {
   try {
    PackageManager packageManager = cordova.getActivity().getPackageManager();
    //Intent testIntent = new Intent(Intent.ACTION_VIEW);
    float versionNumber = Float.parseFloat(android.os.Build.VERSION.RELEASE.substring(0, 3));
    String intentType = Intent.ACTION_GET_CONTENT;

    if (versionNumber < 5.0) {
     intentType = Intent.ACTION_VIEW;
    }

    Intent testIntent = new Intent(intentType);

    testIntent.setType(MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileExt));
    if (packageManager.queryIntentActivities(testIntent, PackageManager.MATCH_DEFAULT_ONLY).size() > 0) {
     return true;
    } else {
     return false;
    }
   } catch (Exception e) {
    System.out.println("DetectPdfReader: err=" + e.getMessage() + "=|");
    Log.e(DEBUG_TAG, e.getMessage());
    return false;
   }
  }
}
