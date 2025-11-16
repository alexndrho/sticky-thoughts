import {
  Body,
  Container,
  Head,
  Html,
  Text,
  Hr,
  Link,
} from "@react-email/components";

interface EmailLinkTemplateProps {
  url: string;
  type: "email-verification" | "password-reset";
}

export default function EmailLinkTemplate({
  url,
  type,
}: EmailLinkTemplateProps) {
  const getSubject = () => {
    switch (type) {
      case "email-verification":
        return "Verify Your Email - StickyThoughts";
      case "password-reset":
        return "Reset Your Password - StickyThoughts";
      default:
        return "StickyThoughts";
    }
  };

  const getHeading = () => {
    switch (type) {
      case "email-verification":
        return "Verify Your Email Address";
      case "password-reset":
        return "Reset Your Password";
      default:
        return "StickyThoughts";
    }
  };

  const getMessage = () => {
    switch (type) {
      case "email-verification":
        return "Thank you for signing up for StickyThoughts! Click the link below to verify your email address:";
      case "password-reset":
        return "You requested to reset your password for your StickyThoughts account. Click the link below to reset your password:";
      default:
        return "Click the link below:";
    }
  };

  const getLinkText = () => {
    switch (type) {
      case "email-verification":
        return "Verify Email";
      case "password-reset":
        return "Reset Password";
      default:
        return "Continue";
    }
  };

  const getFooterMessage = () => {
    switch (type) {
      case "email-verification":
        return "If you didn't create an account with StickyThoughts, please ignore this email.";
      case "password-reset":
        return "If you didn't request a password reset, please ignore this email. Your password will remain unchanged.";
      default:
        return "If you didn't request this, please ignore this email.";
    }
  };

  return (
    <Html>
      <Head>
        <title>{getSubject()}</title>
      </Head>

      <Body>
        <Container>
          <Text>StickyThoughts</Text>

          <Text>{getHeading()}</Text>

          <Text>Hello,</Text>

          <Text>{getMessage()}</Text>

          <Link href={url}>{getLinkText()}</Link>

          <Hr />

          <Text>{getFooterMessage()}</Text>

          <Text>
            Best regards,
            <br />
            StickyThoughts
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
