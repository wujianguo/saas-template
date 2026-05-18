import { Test } from "@nestjs/testing"
import { HELLO_MESSAGE } from "@workspace/api"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"

describe("AppController", () => {
  let appController: AppController

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get(AppController)
  })

  it("returns the shared hello payload", () => {
    expect(appController.getHello()).toEqual({
      message: HELLO_MESSAGE,
    })
  })
})
