import { Request, Response } from "express"; 
import { AuthLoginDTO } from "../dtos/auth.dto";
import { validate } from "class-validator";
import { ResponseSuccess, ResponseError, ResponseErrorValidation, logger, createError } from "../utils/util";
import { HttpStatus } from "../utils/constant";

export class AuthController {
  async HandleLogin(req: Request, res: Response): Promise<Response> {
    try {
      const authDto = Object.assign(new AuthLoginDTO(), req.body)

      // Validate DTO
      const errors = await validate(authDto);
      if (errors.length > 0) {
        return ResponseErrorValidation(res, errors, 'Validation Error', HttpStatus.BAD_REQUEST)
      }

      return ResponseSuccess(res, authDto)
    } catch (error: any) {
      logger.info(error)
      return ResponseError(res, error, error.message, error.code)
    }
  }
}