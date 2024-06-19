import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

describe('Component Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    require.resolve('../collection.json')
  );
  const defaultOptions = {
    name: 'foo',
    // path: 'src/app',
    inlineStyle: false,
    inlineTemplate: false,
    displayBlock: false,
    type: 'Component',
    skipTests: false,
    module: undefined,
    export: false,
    project: 'bar',
  };

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  const appOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
    skipPackageJson: false,
  };
  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await schematicRunner.runSchematic('workspace', workspaceOptions);
    appTree = await schematicRunner.runSchematic(
      'application',
      appOptions,
      appTree
    );
  });

  it('should contain a TestBed compileComponents call', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('component', options, appTree);
    const tsContent = tree.readContent('/projects/bar/src/app/foo/foo.component.spec.ts');
    expect(tsContent).toContain('compileComponents()');
  });

  it('should create a component', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner.runSchematic(
      'ui-component',
      options,
      appTree
    );
    const files = tree.files;
    expect(files).toEqual(
      jasmine.arrayContaining([
        '/projects/bar/src/app/foo/foo.component.css',
        '/projects/bar/src/app/foo/foo.component.html',
        '/projects/bar/src/app/foo/foo.component.spec.ts',
        '/projects/bar/src/app/foo/foo.component.ts',
      ])
    );
  });
});
