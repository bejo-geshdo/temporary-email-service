import style from "./Hero.module.css";
import SES from "../../assets/aws/SES.svg";
import Lambda from "../../assets/aws/Lambda.svg";
import S3 from "../../assets/aws/S3.svg";
import APIGateway from "../../assets/aws/APIGateway.svg";
import DynamoDB from "../../assets/aws/DynamoDB.svg";
import ImageCircle from "./ImageCircle";

const Hero = () => {
  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight, // 100vh
      behavior: "smooth",
    });
  };

  return (
    <div className={style.heroContainer}>
      <div className={style.heroContent}>
        <div className={style.text}>
          <h1>Serverless temporary email</h1>
          <h3>What this page does?</h3>
          <p>This page let's you create a temporary email address</p>
          <p>The address and emails will be deleted after 10 minutes</p>
          <p>The address and emails can be renewed by 10 minutes up 24h</p>

          <h3>The tech!</h3>
          <p>The backend is built AWS Serverless serivces</p>
          <p>
            AWS Simple email services recives the emails and Lambda functions
            handels all the logic
          </p>
          <p>
            You can read about how it works on my{" "}
            <a
              href="https://github.com/bejo-geshdo/temporary-email-service"
              target="_blank"
            >
              GitHub page
            </a>
          </p>
          <p></p>
        </div>
        <div className={style.imageContainer}>
          <ImageCircle
            images={[
              {
                src: SES,
                alt: "aws SES icon",
                url: "https://aws.amazon.com/ses/",
              },
              {
                src: Lambda,
                alt: "AWS Lambda icon",
                url: "https://aws.amazon.com/lambda/",
              },
              {
                src: S3,
                alt: "AWS S3 icon",
                url: "https://aws.amazon.com/s3/",
              },
              {
                src: APIGateway,
                alt: "AWS API Gateway icon",
                url: "https://aws.amazon.com/api-gateway/",
              },
              {
                src: DynamoDB,
                alt: "AWS DynamoDB icon",
                url: "https://aws.amazon.com/dynamodb/",
              },
            ]}
          />
        </div>
      </div>
      <div className={style.bounceArrow} onClick={handleScroll}>
        <p>Try the app</p>
        <p>↓</p>
      </div>
    </div>
  );
};

export default Hero;
