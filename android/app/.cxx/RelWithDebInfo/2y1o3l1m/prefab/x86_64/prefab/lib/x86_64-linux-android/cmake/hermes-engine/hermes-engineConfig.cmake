if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/ademarneto/.gradle/caches/8.14.3/transforms/23df5d646d5b9fc6266dc13d922c0b13/transformed/hermes-android-0.82.1-release/prefab/modules/hermesvm/libs/android.x86_64/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/ademarneto/.gradle/caches/8.14.3/transforms/23df5d646d5b9fc6266dc13d922c0b13/transformed/hermes-android-0.82.1-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

