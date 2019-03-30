NATIVE_APP_MANIFEST="${PWD}/ping_pong.json"
FIREFOX_MANIFEST_DESTINATION="${HOME}/Library/Application Support/Mozilla/NativeMessagingHosts/"
echo COPY FILE
echo $NATIVE_APP_MANIFEST
echo TO
echo $FIREFOX_MANIFEST_DESTINATION
# create destination directories if not exist
mkdir -p "$FIREFOX_MANIFEST_DESTINATION"
# copy interactively
cp -i $NATIVE_APP_MANIFEST "$FIREFOX_MANIFEST_DESTINATION"
