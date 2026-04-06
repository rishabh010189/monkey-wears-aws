# ☁️ Monkey Wears – AWS Backend

Serverless backend for the **Monkey Wears Ecommerce Platform**, built using **AWS API Gateway**, **AWS Lambda**, and **Amazon S3**.

This backend serves product data and static assets (images) for the frontend React application.

---

## 🚀 Features

- ⚡ Serverless architecture (no server management)
- 🌐 REST API using API Gateway
- 🧠 Business logic via AWS Lambda
- 🗂️ Static product data (JSON)
- 🖼️ Image hosting using Amazon S3
- 🔓 CORS-enabled APIs for frontend integration

---

## 🛠️ Tech Stack

- **AWS Lambda**
- **AWS API Gateway**
- **Amazon S3**
- **Node.js**
- **AWS CDK / Serverless Framework (optional)**

---

## 📂 Project Structure

```id="3g3v6q"
backend/
│── lambda/
│   ├── getProducts.js
│   ├── utils/
│
│── data/
│   ├── products.json
│
│── infrastructure/
│   ├── cdk-stack.js   (if using CDK)
│
│── package.json
│── README.md
```

---

## ⚙️ How It Works

1. Client (React App) sends request to API Gateway
2. API Gateway triggers Lambda function
3. Lambda reads product data (JSON or S3)
4. Returns response to frontend
5. Images are served directly from S3 URLs

---

## 🔗 API Endpoints

### 📦 Get Products

```http id="g1tw7k"
GET /products
```

### ✅ Response

```json id="xq1zqk"
[
  {
    "id": 1,
    "name": "T-Shirt",
    "price": 999,
    "image": "https://your-s3-bucket-url/products/tshirt.jpg"
  }
]
```

---

## ☁️ AWS Setup

### 1. Create S3 Bucket

- Store product images inside:

```
products/
```

- Make objects publicly accessible (or use signed URLs)

---

### 2. Upload `products.json`

You can either:

- Keep it inside Lambda (static)
- OR upload to S3 and fetch dynamically

---

### 3. Create Lambda Function

Example (`getProducts.js`):

```js id="jrnhtp"
export const handler = async () => {
  const products = require('../data/products.json');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(products),
  };
};
```

---

### 4. Setup API Gateway

- Create HTTP API
- Add route:

```
GET /products
```

- Integrate with Lambda

---

### 5. Enable CORS

Ensure Lambda response includes:

```js id="8z57r5"
"Access-Control-Allow-Origin": "*"
```

---

## 🚀 Deployment

### Using AWS CDK

```bash id="vd0p69"
npm install
cdk bootstrap
cdk deploy
```

---

### Using Manual Deployment

- Zip Lambda code
- Upload to AWS Lambda
- Connect via API Gateway

---

## 🔐 Environment Variables

(Optional)

```env id="yebk8r"
S3_BUCKET_NAME=your-bucket-name
REGION=ap-south-1
```

---

## 🧪 Testing

Use tools like:

- Postman
- cURL

```bash id="w5xg4f"
curl https://your-api-url/products
```

---

## 🔥 Future Improvements

- 🛒 Add cart & order APIs
- 🔐 Authentication (JWT / Cognito)
- 🧾 Order management system
- 🔍 Search & filtering
- 📦 Pagination support
- 📊 Logging & monitoring (CloudWatch)
- ⚡ Caching with API Gateway / CloudFront

---

## ⚠️ Common Issues

- ❌ CORS errors → check headers in Lambda
- ❌ 403 from S3 → check bucket policy
- ❌ 502 from API Gateway → check Lambda logs

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Open a Pull Request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Rishabh Srivastava**

---

> Built with ☁️ AWS to scale effortlessly 🚀
