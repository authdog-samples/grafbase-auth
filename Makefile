FILTER_CONSOLE=--filter @authdog-samples/grafbase-web
FILTER_API=--filter @authdog-samples/grafbase-api
ALL_PROJECTS := $(FILTER_CONSOLE) $(FILTER_API)

install:
	pnpm i

dev:
	pnpm turbo run dev $(ALL_PROJECTS)

deploy:
	pnpm turbo run deploy $(ALL_PROJECTS)

dev_web:
	pnpm turbo run dev $(FILTER_CONSOLE)

dev_api:
	pnpm turbo run dev $(FILTER_API)

deploy_api:
	pnpm turbo run deploy $(FILTER_API)

pretty:
	pnpm format