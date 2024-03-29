import { Signal, ISignal } from '@lumino/signaling';

import { Toolbar } from '@jupyterlab/apputils';

import { ToolbarItems } from '../components';

export class QueryToolbar extends Toolbar {
  constructor(connectionUrl: string) {
    super();
    this._onBackButtonClicked = this._onBackButtonClicked.bind(this);
    this._onRunButtonClicked = this._onRunButtonClicked.bind(this);
    this.addItem(
      'back',
      new ToolbarItems.BackButton({ onClick: this._onBackButtonClicked })
    );
    this.addItem(
      'run',
      new ToolbarItems.RunButton({ onClick: this._onRunButtonClicked })
    );
    this.addItem('spacer', Toolbar.createSpacerItem());
    this.addItem('url', new ToolbarItems.ConnectionUrlItem(connectionUrl));
    this.addItem('loading', this._loadingIcon);
  }

  get backButtonClicked(): ISignal<this, void> {
    return this._backButtonClicked;
  }

  private _onBackButtonClicked(): void {
    this._backButtonClicked.emit(void 0);
  }

  get runButtonClicked(): ISignal<this, void> {
    return this._runButtonClicked;
  }

  private _onRunButtonClicked(): void {
    this._runButtonClicked.emit(void 0);
  }

  setLoading(isLoading: boolean): void {
    this._loadingIcon.setLoading(isLoading);
  }

  private readonly _loadingIcon: ToolbarItems.LoadingIcon =
    new ToolbarItems.LoadingIcon();
  private readonly _backButtonClicked: Signal<this, void> = new Signal(this);
  private readonly _runButtonClicked: Signal<this, void> = new Signal(this);
}
