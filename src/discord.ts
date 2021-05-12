export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  verified: boolean;
  email: string;
  flags: number;
  premium_type: number;
  public_flags: number;
}

export interface DiscordAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
