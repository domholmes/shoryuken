package com.example.smartreminder;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class JsonArrayBuilder
{
    public JSONArray build(HttpResponse response) throws IOException, JSONException
    {
        HttpEntity entity = response.getEntity();

        InputStream inputStream = entity.getContent();

        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"), 8);
        StringBuilder sb = new StringBuilder();

        String line;
        while ((line = reader.readLine()) != null)
        {
            sb.append(line + "\n");
        }

        String result = sb.toString();

        return new JSONArray(result);
    }
}
