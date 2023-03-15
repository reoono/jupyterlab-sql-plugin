from .handlers import register_handlers


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": "jupyterlab-sql-plugin"
    }]



def _jupyter_server_extension_points():
    return [{
        "module": "jupyterlab_sql_plugin"
    }]


def _load_jupyter_server_extension(server_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.

    Parameters
    ----------
    server_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    register_handlers(server_app.web_app)
    server_app.log.info("Registered jupyterlab-sql-plugin server extension")


# For backward compatibility with notebook server - useful for Binder/JupyterHub
load_jupyter_server_extension = _load_jupyter_server_extension

