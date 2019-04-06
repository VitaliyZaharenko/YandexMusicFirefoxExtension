
import sys, os
from string import Template

try:

    params = {}
    params["app_name"] = os.environ["APP_NAME"]
    params["app_path"] = os.environ["APP_FOLDER"]
    params["extension_id"] = os.environ["EXTENSION_ID"]
    params["description"] = os.environ["DESCRIPTION"]

    template_filename = os.environ["TEMPLATE_FILE"]

    with open(template_filename) as f:
        template_content = Template(f.read())
    result_json = template_content.substitute(params)

    output_filename = os.path.abspath("generated_manifest/{app_name}.json".format(**params))
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    with open(output_filename, "w+") as f:
        f.write(result_json)
    print(output_filename)


except KeyError as e:
    print("Not find parameter:")
    print(e)
