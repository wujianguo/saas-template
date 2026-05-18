import { Injectable } from "@nestjs/common"
import { HELLO_MESSAGE, type HelloResponse } from "@workspace/api"

@Injectable()
export class AppService {
  getHello(): HelloResponse {
    return {
      message: HELLO_MESSAGE,
    }
  }
}
