NATIVE_APP_MANIFEST="${PWD}/yandex_music_ui.json"
FIREFOX_MANIFEST_DESTINATION="${HOME}/Library/Application Support/Mozilla/NativeMessagingHosts/"
echo Copy File
echo $NATIVE_APP_MANIFEST
echo To Directory
echo $FIREFOX_MANIFEST_DESTINATION
# create destination directories if not exist
mkdir -p "$FIREFOX_MANIFEST_DESTINATION"
# copy interactively
cp -i $NATIVE_APP_MANIFEST "$FIREFOX_MANIFEST_DESTINATION"
