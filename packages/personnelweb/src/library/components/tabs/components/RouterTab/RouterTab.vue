<template>
  <div class="router-tab">
    <!-- 页签头部 -->
    <header class="router-tab-header">
      <div class="tab-nav">
        <div class="router-tab-scroll">
          <!-- 页签列表 -->
          <transition-group
            tag="ul"
            class="router-tab-nav"
            v-bind="
              typeof tabTransition === 'string'
                ? { name: tabTransition }
                : tabTransition
            "
            @after-enter="onTabTransitionEnd"
            @after-leave="onTabTransitionEnd">
            <router-link
              v-for="({ id, to, title, icon, tips, closable }, index) in items"
              :key="id || to"
              class="router-tab-item"
              tag="li"
              :class="{
                actived: activedTab === id,
                contextmenu: contextmenu.id === id
              }"
              :title="i18nText(tips || title) || lang.tab.untitled"
              :to="to"
              @contextmenu.native.prevent="e => showContextmenu(id, index, e)">
              <slot
                v-bind="{
                  tab: items[index],
                  tabs: items,
                  index
                }">
                <i v-if="icon" class="tab-icon" :class="icon" />
                <span class="tab-title">{{
                  i18nText(title) || lang.tab.untitled
                }}</span>
                <i
                  v-if="closable !== false && items.length > 1"
                  class="tab-close"
                  :title="lang.contextmenu.close"
                  @click.prevent="closeTab(id)" />
              </slot>
            </router-link>
          </transition-group>
        </div>

        <!-- 页签滚动 -->
        <a class="nav-prev" @click="tabScroll('left')" />
        <a class="nav-next" @click="tabScroll('right')" />
      </div>
      <slot name="header"></slot>
    </header>

    <!-- 页面容器 -->
    <div class="router-tab-container" :class="{ loading }">
      <!--      面包屑-->

      <!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
      <!--        <el-breadcrumb-item>{{breadcrumbClass1}}</el-breadcrumb-item>-->
      <!--        <el-breadcrumb-item class="on">{{breadcrumbClass2}}</el-breadcrumb-item>-->
      <!--      </el-breadcrumb>-->

      <!-- 路由页面 -->
      <router-alive ref="routerAlive" :alive-id="aliveId" @update="updateTab">
        <transition
          v-bind="
            typeof pageTransition === 'string'
              ? { name: pageTransition }
              : pageTransition
          "
          appear
          @after-enter="onPageTransitionEnd"
          @after-leave="onPageTransitionEnd">
          <router-view
            v-if="isViewAlive"
            ref="routerView"
            v-bind="routerView"
            class="router-tab-page" />
        </transition>
      </router-alive>

      <!-- iframe 页面 -->
      <transition-group
        v-bind="
          typeof pageTransition === 'string'
            ? { name: pageTransition }
            : pageTransition
        "
        tag="div"
        class="router-tab-iframes">
        <iframe
          v-for="url in iframes"
          v-show="url === currentIframe"
          :key="url"
          :src="url"
          frameborder="0"
          class="router-tab-iframe" />
      </transition-group>
    </div>

    <!-- 右键菜单 -->
    <transition name="router-tab-zoom">
      <div
        v-if="contextmenu.id"
        class="router-tab-contextmenu"
        :style="`left: ${contextmenu.left}px; top: ${contextmenu.top}px;`">
        <a
          class="contextmenu-item"
          :disabled="!isContextTabActived"
          @click="isContextTabActived && refreshTab(contextmenu.id)">
          {{ lang.contextmenu.refresh }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="items.length < 2"
          @click="items.length > 1 && refreshAll()">
          {{ lang.contextmenu.refreshAll }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!isContextTabCanBeClosed"
          @click="isContextTabCanBeClosed && closeTab(contextmenu.id)">
          {{ lang.contextmenu.close }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!tabsLeft.length"
          @click="tabsLeft.length && closeMulti(tabsLeft)">
          {{ lang.contextmenu.closeLefts }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!tabsRight.length"
          @click="tabsRight.length && closeMulti(tabsRight)">
          {{ lang.contextmenu.closeRights }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!tabsOther.length"
          @click="tabsOther.length && closeMulti(tabsOther)">
          {{ lang.contextmenu.closeOthers }}
        </a>
      </div>
    </transition>
  </div>
</template>
<style lang="scss">
.tab-nav {
  width: calc(100vw - 580px) !important;
  display: inline-block;
  flex: 1;
  position: relative;
}
.router-tab-header {
  display: flex;
}
</style>

<script src="./index.js"></script>

<style lang="scss" src="../../scss/routerTab.scss"></style>
<style lang="scss" src="../../scss/transition.scss"></style>
