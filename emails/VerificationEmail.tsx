import{
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail ({username,otp}: VerificationEmailProps){
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font 
                    fontFamily='Roboto'
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url:"https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
                        format:'woff2',
                        }} 
                    fontWeight={400}
                    fontStyle='normal'    
                    />
            </Head>
            <Preview>Here's your verification code: {otp}</Preview>
                <Section>
                    <Row>
                        <Heading as="h2">Hello {username},</Heading>
                    </Row>
                    <Row>
                        <Text>
                            Thank You for registering with us. Please verify your verification code to complete the registration.
                        </Text>
                    </Row>
                    <Row>
                        <Text>{otp}</Text>
                    </Row>
                    {/* <Row>
                        <Button href="https://example.com/verify">Verify</Button>
                    </Row> */}
                </Section>
            
        </Html>
    )
}