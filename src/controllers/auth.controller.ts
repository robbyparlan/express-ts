import { Request, Response } from "express"; 
import { AuthLoginDTO } from "../dtos/auth.dto";
import { validate } from "class-validator";

export class AuthController {
  async HandleLogin(req: Request, res: Response): Promise<Response> {
    try {
      const authDto = Object.assign(new AuthLoginDTO(), req.body)

      // Validate DTO
      const errors = await validate(authDto);
      if (errors.length > 0) {
         return res.status(400).json({ errors });
      }
     return res.json(authDto)
    } catch (error) {
     return res.status(400).json({code: 400})
    }
  }
}