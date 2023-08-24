/* eslint-disable unicorn/prefer-node-protocol */
import fs from 'fs'

const classId = 'Order'

const isNewSheet = true // if true adds imports

const sheetName = 'order-status'

const methodName = 'exampleMethod'

const methodType = 'WRITE'

const inputModel = `${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}Input`
const inputModelWithLowerCase = `${methodName}Input`

const outputModel = `${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}Output`
const outputModelWithLowerCase = `${methodName}Output`

function getMethodSources() {
  fs.appendFileSync(
    `classes/${classId}/template.yml`,
    `
  - method: ${methodName}
    description: >
      Describe me
    inputModel: ${inputModel}
    outputModel: ${outputModel}
    type: ${methodType}
    handler: ${sheetName}.${methodName}
  `,
  )

  const imports = isNewSheet ? `import { StepResponse } from '@retter/rdk'
import { CustomError } from 'utils/custom-error'
import { ${inputModel}, ${outputModel} } from './models'
import { ClassData } from './types'
  ` : ''

  fs.appendFileSync(
    `classes/${classId}/${sheetName}.ts`,
    `${imports}
export async function ${methodName}(data: ClassData<${inputModel}, ${outputModel}>): Promise<StepResponse> {  
  try {
    const input = data.request.body!
    data.response = { statusCode: 200 }
  } catch (error) {
    data.response = error instanceof CustomError ? error.friendlyResponse : new CustomError('System', 1000, 500, { issues: (error as Error).message }).friendlyResponse
  }
  return data
}
`,
  )

  fs.appendFileSync(
    `classes/${classId}/models.ts`,
    `
export const ${inputModelWithLowerCase} = z.object({})
export type ${inputModel} = z.infer<typeof ${inputModelWithLowerCase}>

export const ${outputModelWithLowerCase} = z.object({})
export type ${outputModel} = z.infer<typeof ${outputModelWithLowerCase}>
`,
  )

  fs.appendFileSync(
    `classes/${classId}/scripts/export-models.ts`,
    `modelExporter(${inputModelWithLowerCase}, '${inputModel}')
modelExporter(${outputModelWithLowerCase}, '${outputModel}')
`,
  )
}

getMethodSources()
