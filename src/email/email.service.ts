import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';
import emailConfig from '../config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;
  constructor(
    @Inject(emailConfig.KEY)
    private readonly config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      }, // TODO: config
    });
  }
  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.config.baseUrl; // TODO: config
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    console.log('[sendMemberJoinVerification] emailAddress:', emailAddress);
    console.log('[sendMemberJoinVerification] pass:', this.config.auth.pass);
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입 확인을 누르시면 인증이 완료됩니다.</br>
        <form action="${url}" method="POST">
            <button>가입확인</button>
        </form>
        `,
    };
    return this.transporter.sendMail(mailOptions);
  }
}
