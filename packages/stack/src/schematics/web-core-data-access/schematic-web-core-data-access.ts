import { chain, Rule, schematic } from '@angular-devkit/schematics'
import { ProjectType } from '@nrwl/workspace'
import { addFiles, addRunScript, normalizeOptions } from '../../utils'
import { WebCoreDataAccessSchematicSchema } from './schema'

export default function (options: WebCoreDataAccessSchematicSchema): Rule {
  const name = options.name || 'data-access'
  const directory = options.directory || options.name
  const normalizedOptions = normalizeOptions({ ...options, name: `${name}/data-access` }, ProjectType.Library)
  const sdkName = `sdk:${options.appName}`
  return chain([
    schematic('web-lib', {
      directory,
      name,
      type: 'data-access',
    }),
    addFiles(normalizedOptions),
    addRunScript(`${sdkName}:watch`, `yarn ${sdkName} --watch`),
    addRunScript(`${sdkName}`, `graphql-codegen --config ${normalizedOptions.projectRoot}/src/codegen.yml`),
  ])
}
