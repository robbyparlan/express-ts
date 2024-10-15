import { Request, Response } from "express"; 
import { AuthLoginDTO } from "../dtos/auth.dto";
import { validate } from "class-validator";
import { ResponseSuccess, ResponseError, ResponseErrorValidation, logger, createError } from "../utils/util";
import { HttpStatus } from "../utils/constant";
import { AuthRepository } from "../repositories/auth.repository";

export class AuthController {
  private authRepository = new AuthRepository();

  async HandleLogin(req: Request, res: Response): Promise<Response> {
    try {
      const authDto = Object.assign(new AuthLoginDTO(), req.body)

      // Validate DTO
      const errors = await validate(authDto);
      if (errors.length > 0) {
        return ResponseErrorValidation(res, errors, 'Validation Error', HttpStatus.BAD_REQUEST)
      }

      let data = await this.authRepository.handleLogin(authDto)

      return ResponseSuccess(res, data)
    } catch (error: any) {
      logger.info(error)
      return ResponseError(res, error, error.message, error.code)
    }
  }
}