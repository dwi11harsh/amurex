import { google, Auth } from "googleapis";

interface getOauth2ClientProps {
  client_id: string;
  client_secret: string;
}

export const getOauth2Client = ({
  userData,
}: {
  userData: getOauth2ClientProps;
}): Auth.OAuth2Client => {
  return new google.auth.OAuth2(
    userData.client_id,
    userData.client_secret,
    process.env.GOOGLE_REDIRECT_URI,
  );
};
