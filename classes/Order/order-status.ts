import { StepResponse } from '@retter/rdk'
import { CustomError } from 'utils/custom-error'
import { ExampleMethodInput, ExampleMethodOutput } from './models'
import { ClassData } from './types'
  
export async function exampleMethod(data: ClassData<ExampleMethodInput, ExampleMethodOutput>): Promise<StepResponse> {  
  try {
    const input = data.request.body!
    data.response = { statusCode: 200 }
  } catch (error) {
    data.response = error instanceof CustomError ? error.friendlyResponse : new CustomError('System', 1000, 500, { issues: (error as Error).message }).friendlyResponse
  }
  return data
}