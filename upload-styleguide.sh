#!/bin/bash

if [ $# != 1 ]; then
   echo "USAGE: $0 <version>"
   exit
fi

VERSION=$1
HOME_DIR=$PWD
CUI_PREFIX=cui-$VERSION

REMOTE_BASE_DIR=/var/www/html
REMOTE_DIST_DIR=$REMOTE_BASE_DIR/styleguide-dist

LOCAL_BUILD_DIR=./build
LOCAL_SRC_DIR=./src
LOCAL_STAGING_DIR=$LOCAL_BUILD_DIR/dist
LOCAL_STAGING_DIR_BAS=$LOCAL_STAGING_DIR/basic
LOCAL_STAGING_DIR_STD=$LOCAL_STAGING_DIR/standard
LOCAL_STAGING_DIR_SRC=$LOCAL_STAGING_DIR/source
LOCAL_STAGING_DIR_DOC=$LOCAL_STAGING_DIR/styleguide

ZIP_FILE_ALL=$CUI_PREFIX-all.zip
ZIP_FILE_BAS=$CUI_PREFIX-basic.zip
ZIP_FILE_STD=$CUI_PREFIX-standard.zip
ZIP_FILE_SRC=$CUI_PREFIX-source.zip
ZIP_FILE_DOC=$CUI_PREFIX-styleguide.zip

if [ -d "$LOCAL_STAGING_DIR" ]; then
	rm -fr $LOCAL_STAGING_DIR
fi
mkdir $LOCAL_STAGING_DIR;


# -----
# Build basic package

echo "Building basic package..."

if [ -d "$LOCAL_STAGING_DIR_BAS" ]; then
	rm -fr $LOCAL_STAGING_DIR_BAS
fi

mkdir $LOCAL_STAGING_DIR_BAS
mkdir $LOCAL_STAGING_DIR_BAS/$CUI_PREFIX
mkdir $LOCAL_STAGING_DIR_BAS/$CUI_PREFIX/css

cp -r $LOCAL_BUILD_DIR/fonts $LOCAL_STAGING_DIR_BAS/$CUI_PREFIX/fonts
cp -r $LOCAL_BUILD_DIR/docs/assets/fonts/cui-* $LOCAL_STAGING_DIR_BAS/$CUI_PREFIX/fonts
cp $LOCAL_BUILD_DIR/docs/public/examples/basic.html $LOCAL_STAGING_DIR_BAS/$CUI_PREFIX
cp $LOCAL_BUILD_DIR/css/cui-basic.css $LOCAL_STAGING_DIR_BAS/$CUI_PREFIX/css/cui-basic.min.css

cd $LOCAL_STAGING_DIR_BAS
zip -r -q $ZIP_FILE_BAS $CUI_PREFIX
mv $ZIP_FILE_BAS ../
cd $HOME_DIR
rm -fr $LOCAL_STAGING_DIR_BAS


# -----
# Build standard package

echo "Building standard package..."

if [ -d "$LOCAL_STAGING_DIR_STD" ]; then
	rm -fr $LOCAL_STAGING_DIR_STD
fi

mkdir $LOCAL_STAGING_DIR_STD
mkdir $LOCAL_STAGING_DIR_STD/$CUI_PREFIX
mkdir $LOCAL_STAGING_DIR_STD/$CUI_PREFIX/css

cp -r $LOCAL_BUILD_DIR/fonts $LOCAL_STAGING_DIR_STD/$CUI_PREFIX/fonts
cp -r $LOCAL_BUILD_DIR/docs/assets/fonts/cui-* $LOCAL_STAGING_DIR_STD/$CUI_PREFIX/fonts
cp -r $LOCAL_BUILD_DIR/img $LOCAL_STAGING_DIR_STD/$CUI_PREFIX/img
cp $LOCAL_BUILD_DIR/docs/public/examples/standard.html $LOCAL_STAGING_DIR_STD/$CUI_PREFIX
cp $LOCAL_BUILD_DIR/docs/public/examples/dashboard.html $LOCAL_STAGING_DIR_STD/$CUI_PREFIX
cp $LOCAL_BUILD_DIR/css/cui-standard.css $LOCAL_STAGING_DIR_STD/$CUI_PREFIX/css/cui-standard.min.css

cd $LOCAL_STAGING_DIR_STD
zip -r -q $ZIP_FILE_STD $CUI_PREFIX
mv $ZIP_FILE_STD ../
cd $HOME_DIR
rm -fr $LOCAL_STAGING_DIR_STD


# -----
# Build source package

echo "Building source package..."

if [ -d "$LOCAL_STAGING_DIR_SRC" ]; then
	rm -fr $LOCAL_STAGING_DIR_SRC
fi

mkdir $LOCAL_STAGING_DIR_SRC
mkdir $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX
mkdir $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX/css

cp -r $LOCAL_SRC_DIR/scss $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX/sass
cp -r $LOCAL_BUILD_DIR/fonts $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX/fonts
cp -r $LOCAL_BUILD_DIR/docs/assets/fonts/cui-* $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX/fonts
cp -r $LOCAL_BUILD_DIR/img $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX/img
cp $LOCAL_BUILD_DIR/docs/public/examples/standard.html $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX
cp $LOCAL_BUILD_DIR/docs/public/examples/dashboard.html $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX
cp $LOCAL_BUILD_DIR/css/cui-basic.css $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX/css/cui-basic.min.css
cp $LOCAL_BUILD_DIR/css/cui-standard.css $LOCAL_STAGING_DIR_SRC/$CUI_PREFIX/css/cui-standard.min.css

cd $LOCAL_STAGING_DIR_SRC
zip -r -q $ZIP_FILE_SRC $CUI_PREFIX
mv $ZIP_FILE_SRC ../
cd $HOME_DIR
rm -fr $LOCAL_STAGING_DIR_SRC


# -----
# Build styleguide package

echo "Building styleguide package..."

if [ -d "$LOCAL_STAGING_DIR_DOC" ]; then
	rm -fr $LOCAL_STAGING_DIR_DOC
fi

mkdir $LOCAL_STAGING_DIR_DOC

cp -r $LOCAL_BUILD_DIR/docs/* $LOCAL_STAGING_DIR_DOC

cd $LOCAL_STAGING_DIR_DOC
zip -r -q $ZIP_FILE_DOC .
mv $ZIP_FILE_DOC ../
cd $HOME_DIR
rm -fr $LOCAL_STAGING_DIR_DOC


# -----
# Bundle everything together into a single zip file

echo "Bundling everything together..."

cd $LOCAL_STAGING_DIR
zip -r -q $ZIP_FILE_ALL .


# -----
# Copy package to server

echo "Copying package to server..."

scp $ZIP_FILE_ALL root@swtg-rtp-dev-7:/var/www/html


# -----
# Process package on server

echo "Processing package on server..."

ssh root@swtg-rtp-dev-7 "\
	rm -fr $REMOTE_DIST_DIR/$VERSION; \
	mkdir $REMOTE_DIST_DIR/$VERSION; \
	cp $REMOTE_BASE_DIR/$ZIP_FILE_ALL $REMOTE_DIST_DIR/$VERSION; \
	cd $REMOTE_DIST_DIR/$VERSION; \
	unzip -q $ZIP_FILE_ALL; \
	rm $ZIP_FILE_ALL; \
	mkdir dist; \
	unzip -q $ZIP_FILE_DOC; \
	rm $ZIP_FILE_DOC; \
	mv *.zip dist; \
   	rm $REMOTE_BASE_DIR/$ZIP_FILE_ALL;"

echo "Finished!"

#cd $REMOTE_BASE_DIR; \
#rm -fr styleguide; \
#unzip -q $ZIP_FILE_ALL; \
