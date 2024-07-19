import { Controller, Post, Body, Put, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SigninDto, SignupDto } from "./dto/auth.dto";
import { GoogleOauthGuard } from "src/google-auth/google-auth.guard";
import { FastifyReplyExpress, FastifyRequestExpress } from "src/types/Request";
import { TokenService } from "./token.service";
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService : TokenService
  ) {}

  @Post("signup")
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @Post("signin")
  async signn(@Body() signin: SigninDto) {
    return await this.authService.signin(signin.email, signin.password);
  }

  @Put("email-verification")
  async verifyEmail(@Body() verificationData: any) {
    const { email, code } = verificationData;
    const isVerified = await this.authService.handleEmailVerification(
      email,
      code,
    );
    return isVerified;
  }
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleLogin(@Req() _req ) {}

  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req : FastifyRequestExpress, @Res() res :FastifyReplyExpress) {
    try {
      const token = await this.authService.oAuthLogin(req.user);
  if (token) {
    return res.redirect(301 ,`http://localhost:3000/auth/oauth/api?token=${token.jwt}` )    
  }      
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }
  
  @Get('logout')
  logout(@Req() req : FastifyRequestExpress, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    // res.clearCookie('access_token');
    // res.clearCookie('refresh_token');
    this.tokenService.revokeGoogleToken(refreshToken);
    // res.redirect('http://localhost:3000/');
  }
}
