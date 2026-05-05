#!/bin/bash
# build package

set -e

if [[ $(basename "$(pwd)") != 'browser-extension' ]]; then
    echo 'not in browser-extension folder'
    exit 1
fi

echo "latest tags:"
git tag | tail -n 5 | sort -r

printf "\ncreate new version:\n"
read -r VERSION


# build release zip files
function create_zip {
    local root_dir
    root_dir=$(pwd)
    local build_dir
    build_dir=$(mktemp -d)

    rm -f release/ta-companion-"$VERSION"-firefox.xpi
    rm -f release/ta-companion-"$VERSION"-chrome.zip

    cp -R extension/. "$build_dir"/
    rm -f "$build_dir"/manifest.json
    rm -f "$build_dir"/manifest-chrome.json
    rm -f "$build_dir"/manifest-firefox.json
    find "$build_dir" -name '.DS_Store' -delete

    # firefox
    cp extension/manifest-firefox.json "$build_dir"/manifest.json
    (
        cd "$build_dir"
        zip -rq "$root_dir"/release/ta-companion-"$VERSION"-firefox.xpi . -x '*.DS_Store'
    )

    # chrome
    cp extension/manifest-chrome.json "$build_dir"/manifest.json
    (
        cd "$build_dir"
        zip -rq "$root_dir"/release/ta-companion-"$VERSION"-chrome.zip . -x '*.DS_Store'
    )

    rm -rf "$build_dir"

}


# create release tag
function create_release {

    git tag -a "$VERSION" -m "new release version $VERSION"
    git push origin "$VERSION"

}


create_zip
create_release


##
exit 0
