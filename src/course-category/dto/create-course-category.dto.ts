import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCourseCategoryDto {
    @IsString()
    @IsNotEmpty()
    name : string

     slug? : string
    @IsString()
    @IsOptional()
    readonly description? : string
}
