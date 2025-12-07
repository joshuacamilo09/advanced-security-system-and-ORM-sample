import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/security/interceptor/transform.interceptor';
import { CreateUserDto, UpdateUserDto } from './DTO/DTO';
import { UserService } from './user.service';
import { AuthGuard } from 'src/security/auth/Guards/AuthGuard';



@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    //logamos um evento importante
    this.logger.log(`User: ${createUserDto.email} created successfully`);
    return this.userService.create(createUserDto);
  }


  @Get()
  findAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(Number(id));
  }
}
