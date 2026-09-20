import fs from 'node:fs';
for (const file of ['src/data/seed.json','server/data.json']) { const data=JSON.parse(fs.readFileSync(file,'utf8')); data.config.media={macosToIos:'/media/macos-ios.mp4',iosToAndroid:'/media/ios-android.mp4'}; fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n'); }
