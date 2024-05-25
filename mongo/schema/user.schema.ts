import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Membership, MembershipSchema } from "./membership.schema";
import { CoursePurchase, CoursePurchaseSchema, MembershipPurchase, MembershipPurchaseSchema } from "./purchase";
import { Document } from "mongoose";
export enum $UserRole {
    USER = 'user',
    ADMIN = 'admin',
    AGENT = 'agent'
}

export type UserDocument = User & Document;

@Schema({timestamps : true})
export class User extends Document{
    @Prop({type : String})
    displayName?: string;
    @Prop({type : String, required : true})
    name: string;

    @Prop({type : String ,required : true, index : true, unique : true})
    email: string;

    @Prop({ default : $UserRole.USER, enum : $UserRole})
    role: $UserRole;
    @Prop({required : true})
    password: string;
    
    @Prop({type : Boolean, default : false})
    verified: boolean;
    
    @Prop({ type: MembershipSchema })
    membership: Membership;

    @Prop({type : MembershipPurchaseSchema})
    memberShipPurchase : MembershipPurchase

    @Prop({type : CoursePurchaseSchema})
    coursePurchase : CoursePurchase[]
    
}


export const UserSchema = SchemaFactory.createForClass(User);