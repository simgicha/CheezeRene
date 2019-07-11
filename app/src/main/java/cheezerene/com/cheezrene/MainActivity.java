package cheezerene.com.cheezrene;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.loadUrl(Config.getStartUrl());
        try
        {
            Log.v("MainActivity", "nnnnn Imagine you got hererererererer");
            String pName = this.getClass().getPackage().getName();
            //this.copy("ChezReneDB","/data/data/"+pName+"/databases/");
            this.copy("Databases.db","/data/data/"+pName+"/app_database/");
            this.copy("0000000000000001.db","/data/data/"+pName+"/app_database/file__0/");

        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    void copy(String file, String folder) throws IOException
    {
        Log.v("MainActivity", "Imagine you got hererererererer");
        File CheckDirectory;
        CheckDirectory = new File(folder);
        if (!CheckDirectory.exists())
        {
            CheckDirectory.mkdir();
        }

        InputStream in = getApplicationContext().getAssets().open(file);
        OutputStream out = new FileOutputStream(folder+file);

        // Transfer bytes from in to out
        byte[] buf = new byte[1024];
        int len; while ((len = in.read(buf)) > 0) out.write(buf, 0, len);
        in.close(); out.close();

    }
}
