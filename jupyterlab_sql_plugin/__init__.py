from .handlers import register_handlers


def _jupyter_server_extension_paths():
    return [{"module": "jupyterlab_sql_plugin"}]


def load_jupyter_server_extension(nbapp):
    nbapp.log.info("Loading server extension jupyterlab_sql_plugin")
    register_handlers(nbapp)
