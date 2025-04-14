import * as React from 'react'

interface EmailTemplateProps {
  firstName: string
  url: string
}

export const EmailVerifyTemplate = ({ firstName, url }: EmailTemplateProps) => (
  <div>
    <h1>欢迎你，{firstName}!</h1>
    <p>请点击以下链接验证您的邮箱地址，之后会自动跳转到应用：</p>
    <a href={url}>验证邮箱</a>
  </div>
)
