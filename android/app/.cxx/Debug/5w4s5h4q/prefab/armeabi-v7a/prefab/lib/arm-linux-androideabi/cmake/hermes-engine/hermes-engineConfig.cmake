if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/ademarneto/.gradle/caches/8.14.3/transforms/19cc58133048a0b0af8c1b41248550ba/transformed/hermes-android-0.82.1-debug/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/ademarneto/.gradle/caches/8.14.3/transforms/19cc58133048a0b0af8c1b41248550ba/transformed/hermes-android-0.82.1-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

