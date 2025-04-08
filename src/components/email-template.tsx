import * as React from 'react'

interface EmailTemplateProps {
  firstName: string
  url: string
}

export const EmailTemplate = ({ firstName, url }: EmailTemplateProps) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href={url}>Verify email</a>
  </div>
)
