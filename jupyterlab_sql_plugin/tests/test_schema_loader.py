from jupyterlab_sql_plugin.schema_loader import load


def test_load_schema():
    schema = load("sql-query.json")
    schema.validate({"query": "some-query", "connectionUrl": "some-url"})
