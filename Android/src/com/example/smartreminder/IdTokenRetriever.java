package com.example.smartreminder;

import android.content.Context;

import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.plus.PlusClient;

import java.io.IOException;

public class IdTokenRetriever
{
    private final String clientId = "audience:server:client_id:714250926431.apps.googleusercontent.com";

	public String GetToken(Context context) throws GoogleAuthException, IOException
    {
        PlusClientService service = new PlusClientService(context);

        //String token = GoogleAuthUtil.getToken(context, mPlusClient.getAccountName(), clientId);

        //return token;

		return "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlmNzhjNTRiMzAyNjYzNTlhOTViZTViMWE0OTk3YjQ4MDUyODFmOWYifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6Iko5TEtQNVhXX3R1Mi1WQjlIMENMdlEiLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdWQiOiI3MTQyNTA5MjY0MzEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3MDkwOTA2NjA1NzAyMzkyOTIiLCJhenAiOiI3MTQyNTA5MjY0MzEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6InRoZWNhcHNhaWNpbmtpZEBnbWFpbC5jb20iLCJpYXQiOjEzNzAyMDE3ODEsImV4cCI6MTM3MDIwNTY4MX0.Wo-FHqD_B1OioaveIPSkhwV1k8uuXAXmMJP8uKreuPPsIEZB4x3xYRCAmjQrPcjakJw17Ux2jLbikCe2GvGRGPa9sGn-3tTZQbFH4IMeGphfXHfoAupjN2G6hL1WpL6JIIh5TZOuASc_ju2UraZjfl1vzdufgKUQGFTujABY6fA";
	}

}
