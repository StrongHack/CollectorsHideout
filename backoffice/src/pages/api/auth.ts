import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "../../../utils/cookies"; // Update the path accordingly
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Authentication request must be a POST request!" });
  }

  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Authentication request must have a body!" });
  }

  try {
    const body = JSON.parse(JSON.stringify(req.body));

    if (!body.username || !body.password) {
      return res.status(400).json({
        message: "Authentication request must have both username and password!",
      });
    }

    if (
      body.username === process.env.NEXT_PUBLIC_BACKOFFICE_USERNAME &&
      body.password === process.env.NEXT_PUBLIC_BACKOFFICE_PASSWORD
    ) {
      const signOptions: SignOptions = {
        expiresIn: "4h",
      };

      const user = {
        username: body.username,
      };

      const token: string = jwt.sign(
        user,
        process.env.NEXT_PUBLIC_SECRET_KEY as Secret,
        signOptions
      );

      return res.status(200).json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ success: false, message: `Error: ${error.message}` });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
