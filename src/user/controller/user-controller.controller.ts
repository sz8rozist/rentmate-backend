import { Controller } from "@nestjs/common";
import { UserService } from "../service/user.service";

@Controller("user")
export class UserControllerController {
  constructor(private service: UserService) {}
}
