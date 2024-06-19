import { apply, applyTemplates, chain, externalSchematic, MergeStrategy, mergeWith, move, Rule, url } from "@angular-devkit/schematics";
import { strings, normalize } from "@angular-devkit/core";
import { UIComponentSchema } from "./ui-component";

export function uiComponentGenerator(options: UIComponentSchema): Rule {
  return () => {
    const templateSource = apply(
      url('./files'), [
        applyTemplates({
          classify: strings.classify,
          dasherize: strings.dasherize,
          name: options.name
        }),
        move(normalize(`/${options.path}/${strings.dasherize(options.name)}`))
      ]
    )
    return chain([
      externalSchematic('@schematics/angular', 'component', options),
      mergeWith(templateSource, MergeStrategy.Overwrite)
    ])
  }
}