if [ "$TRAVIS_PULL_REQUEST" == false ] && [ "$TRAVIS_BRANCH "== "master" ] && [ -z "$TRAVIS_TAG" ]; then
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"

  git checkout master
  git stash

  mkdir -p projects/ngrx-store-storagesync/.git
  git remote set-url origin "https://${GITHUB_USERNAME}:${GITHUB_API_TOKEN}@github.com/larscom/ngrx-store-storagesync.git"

  npm version patch --prefix projects/ngrx-store-storagesync -m "[ ${TRAVIS_BUILD_NUMBER} ] - ${TRAVIS_COMMIT_MESSAGE}"

  sleep 1

  git push --follow-tags
fi
