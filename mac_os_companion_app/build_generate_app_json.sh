export APP_FOLDER=$1
export APP_NAME="yandex_music_ui"
export TEMPLATE_FILE=$PWD/app_manifest_template.json
export EXTENSION_ID=yandex_music_plugin@vtz.bip
export DESCRIPTION="Native app for controlling Ynadex Music with media key or with menu bar popup"

APP_MANIFEST=$(python generate_app_json.py)
echo $APP_MANIFEST
