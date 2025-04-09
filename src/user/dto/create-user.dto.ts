import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateProfileDto } from "./create-profile.dto";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    userName:string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsOptional()   
    profile:CreateProfileDto ;



}
