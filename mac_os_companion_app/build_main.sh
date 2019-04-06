
SCHEME_NAME=YandexMusicExtensionCompanion
PREFIX_PATH=$PWD/build
POSTFIX_PATH=Contents/MacOS/YandexMusicExtensionCompanion
# Debug | Release
TARGET=Release

APP_PATH=$PREFIX_PATH/$TARGET/$SCHEME_NAME.app/$POSTFIX_PATH

xcodebuild -scheme $SCHEME_NAME SYMROOT=$PREFIX_PATH -configuration $TARGET > /dev/null 2>&1

if [ $? -ne 0 ]; then
  echo "Error when building project"
fi

GENERATED_MANIFEST_PATH=$(./build_generate_app_json.sh $APP_PATH)

./build_move_native_app_manifest.sh $GENERATED_MANIFEST_PATH
