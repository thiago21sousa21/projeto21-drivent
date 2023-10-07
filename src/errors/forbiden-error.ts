import { ApplicationError } from "@/protocols";

export function forbidenError (): ApplicationError{
    return {
        name: 'forbidenError',
        message:'You do not have permission to acess this resource' 
    }
}