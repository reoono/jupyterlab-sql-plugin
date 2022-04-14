import * as uuid from 'uuid';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';

import { IEditorServices } from '@jupyterlab/codeeditor';

import { ILauncher } from '@jupyterlab/launcher';

import { JupyterLabSqlWidget } from './widget';

import { createTracker } from './tracker';

import { PageName } from './page';

import { requestAPI } from './handler';

import '../style/index.css';

function activate (
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  launcher: ILauncher | null,
  editorServices: IEditorServices,
  restorer: ILayoutRestorer,
  settingRegistry: ISettingRegistry | null
) {
  if (settingRegistry) {
    settingRegistry
      .load(plugin.id)
      .then(settings => {
        console.log('jupyterlab-sql-plugin settings loaded:', settings.composite);
      })
      .catch(reason => {
        console.error('Failed to load settings for jupyterlab-sql-plugin.', reason);
      });
  }

  requestAPI<any>('get_example')
    .then(data => {
      console.log(data);
    })
    .catch(reason => {
      console.error(
        `The jupyterlab_sql_plugin server extension appears to be missing.\n${reason}`
      );
    });
  
    const tracker: WidgetTracker<JupyterLabSqlWidget> = createTracker();
  const command: string = 'jupyterlab-sql:open';

  restorer.restore(tracker, {
    command,
    args: widget => ({
      initialWidgetName: widget.name,
      initialPageName: widget.pageName,
      initialConnectionUrl: widget.connectionUrl,
      initialTableName: widget.tableName,
      initialSqlStatement: widget.sqlStatement
    }),
    name: widget => widget.name
  });

  app.commands.addCommand(command, {
    label: ({ isPalette }) => (isPalette ? 'New SQL session' : 'SQL'),
    iconClass: 'p-Sql-DatabaseIcon',
    execute: ({
      initialWidgetName,
      initialPageName,
      initialConnectionUrl,
      initialTableName,
      initialSqlStatement
    }) => {
      const name = <string>(initialWidgetName || uuid.v4());
      const pageName = <PageName>(initialPageName || PageName.Connection);
      const connectionUrl = <string>(
        (initialConnectionUrl || 'postgres://localhost:5432/postgres')
      );
      const tableName = <string>(initialTableName || '');
      const sqlStatement = <string>(initialSqlStatement || '');
      const widget = new JupyterLabSqlWidget(editorServices.factoryService, {
        name,
        pageName,
        connectionUrl,
        tableName,
        sqlStatement
      });
      app.shell.add(widget);
      tracker.add(widget);
    }
  });

  palette.addItem({ command, category: 'SQL', args: { isPalette: true } });

  if (launcher) {
    launcher.add({ command, category: 'Other' });
  }
}

/**
 * Initialization data for the jupyterlab-sql-plugin extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-sql-plugin:plugin',
  autoStart: true,
  requires: [ICommandPalette, ILauncher, IEditorServices, ILayoutRestorer],
  optional: [ISettingRegistry],
  activate: activate
};

export default plugin;
